/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

function getStackTrace() {
	let stack;

	try {
		throw new Error("");
	} catch (error) {
		stack = (error as Error).stack || "";
	}

	stack = stack.split("\n").map((line) => line.trim());
	return stack.splice(stack[0] === "Error" ? 2 : 1);
}

const getInitiator = () => {
	// _getInitiatorLine, _ObjectInfoLine, caller
	const [, , caller] = getStackTrace();
	const file = caller.split("/").at(-1) || "";
	return file.replace(")", "");
};

const warn = (...args: any[]) => {
	console.group(`${new Date().toISOString()} - WARN`);
	console.warn(...args);
	console.groupEnd();
};
const error = (...args: any[]) => {
	console.group(`${new Date().toISOString()} - ERROR`);
	console.error(...args);
	console.groupEnd();
};
const info = (...args: any[]) => {
	console.group(`${new Date().toISOString()} - INFO - ${getInitiator()}`);
	console.log(...args);
	console.groupEnd();
};

/**
 * @description a simple interface logger for logging to the console and into a log drain in the future
 * @example
 * log.warn('this is a warning');
 * log.error('this is an error');
 * log.info('this is an info');
 * @exports log
 */
export const log = {
	warn,
	error,
	info,
};
