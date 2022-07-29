import { UserMinimum } from "types/User";

const getMockAvatar = (): string => {
  return `https://randomuser.me/api/portraits/${
    Math.floor(Math.random() * 10) % 2 === 0 ? "men" : "women"
  }/${Math.floor(Math.random() * 100)}.jpg`;
};

export const __MOCK_USERS__: UserMinimum[] = [
  {
    uid: "user-1a0",
    fullName: "Jean-Pierre",
    photoURL: getMockAvatar(),
    promotion: "RIL21-1",
  },
  {
    uid: "user-1a1",
    fullName: "Jean-Bernard",
    photoURL: getMockAvatar(),
    promotion: "RIL21-2",
  },
  {
    uid: "user-1a2",
    fullName: "Jean-Jacques",
    photoURL: getMockAvatar(),
    promotion: "RIL21-1",
  },
  {
    uid: "user-1a3",
    fullName: "Jean-Simon",
    photoURL: getMockAvatar(),
    promotion: "RIL21-2",
  },
  {
    uid: "user-1a4",
    fullName: "Jean-Basile",
    photoURL: getMockAvatar(),
    promotion: "RIL21-1",
  },
];
