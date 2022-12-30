import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import sharp from "sharp";

import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { log } from "@/lib/log";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "10mb",
		},
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Upload image to Supabase
	if (req.method === "POST") {
		const { image } = req.body;

		if (!image) {
			return res.status(500).json({ message: "No image provided" });
		}

		const session = await getSession({ req });
		if (!session) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		let user = await prisma.user.findUnique({
			where: { email: session.user?.email as string },
		});
		const { id: userId } = user || {};
		if (!user || !userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		try {
			const contentType = image.match(/data:(.*);base64/)?.[1];
			const base64FileData = image.split("base64,")?.[1];

			if (!contentType || !base64FileData) {
				return res.status(500).json({ message: "Image data not valid" });
			}

			// Resize image and compress
			const buffer = decode(base64FileData);
			const resizedBuffer = await sharp(Buffer.from(buffer), {
				animated: true,
				pages: -1,
			})
				.resize(128, 128, {
					fit: sharp.fit.cover,
					// position: sharp.strategy.entropy,
				})
				.toFormat("webp")
				.webp({ quality: 90 })
				.toBuffer();

			// Upload image
			const fileName = `${userId}/${nanoid()}`;
			const ext = "webp"; //contentType.split("/")[1];
			const path = `${fileName}.${ext}`;

			const { data, error: uploadError } = await storage
				.from(process.env.STORAGE_BUCKET_NAME as string)
				.upload(path, resizedBuffer, {
					contentType,
					upsert: true,
				});

			if (uploadError) {
				log.error(uploadError);
				throw new Error("Unable to upload image to storage");
			}

			// Construct public URL
			const url = `${
				process.env.STORAGE_URL as string
			}/storage/v1/object/public/${process.env.STORAGE_BUCKET_NAME as string}/${
				data.path
			}`;

			// Update user profile image
			user = await prisma.user.update({
				where: { id: userId },
				data: {
					image: url,
				},
			});

			return res.status(200).json({ url, user });
		} catch (e) {
			res.status(500).json({
				message: e instanceof Error ? e.message : "Something went wrong",
				stack: e instanceof Error ? e.stack : null,
			});
		}
	}

	if (req.method === "DELETE") {
		const session = await getSession({ req });
		if (!session) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		let user = await prisma.user.findUnique({
			where: { email: session.user?.email as string },
		});
		const { id: userId, image } = user || {};
		if (!user || !userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (!image) {
			return res.status(200).json({ message: "No image to delete" });
		}

		try {
			// Delete image in storage
			const { error } = await storage
				.from(process.env.STORAGE_BUCKET_NAME as string)
				.remove([`${userId}/${image.split("/").pop()}`]);

			if (error) {
				throw new Error("Unable to delete image in storage");
			}
			// Delete user profile image
			user = await prisma.user.update({
				where: { id: userId },
				data: {
					image: null,
				},
			});

			return res.status(200).json({ user });
		} catch (e) {
			res.status(500).json({ message: "Something went wrong" });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader("Allow", ["POST", "DELETE"]);
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
