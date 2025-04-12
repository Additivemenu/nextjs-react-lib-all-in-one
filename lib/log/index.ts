export const log = (...message: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...message);
  }
};

export const debug = (...message: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.debug(...message);
  }
};

export const warn = (...message: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(...message);
  }
};

export const error = (...message: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(...message);
  }
};

export const logGroup = (groupName: string) => {
  if (process.env.NODE_ENV === "development") {
    console.groupCollapsed(groupName);
  }
};

export const logGroupEnd = () => {
  if (process.env.NODE_ENV === "development") {
    console.groupEnd();
  }
};
