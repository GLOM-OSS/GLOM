export const sAUTH403 = {
  En: `Your session has expired. Please login!`,
  Fr: '',
};
export const AUTH03 = (message: string) => ({
  En: `Login request failed with error: ${message}`,
  Fr: '',
});
export const AUTH06 = (message: string) => ({
  En: `Log out error ${message}`,
  Fr: '',
});
export const AUTH07 = {
  En: `Please, enter the provide credentials`,
  Fr: '',
};
export const AUTH08 = {
  En: `Oops, you have an ongoing subscription. Try later`,
  Fr: '',
};
export const AUTH401 = {
  En: `Incorrect email or password.`,
  Fr: '',
};
export const AUTH404 = (search: string) => ({
  En: `${search} not found.`,
  Fr: '',
});

export const AUTH403 = (ressource: string) => ({
  En: `Access borbidden for ${ressource}.`,
  Fr: '',
});
export const AUTH501 = (element: string) => ({
  En: `Sorry, this ${element} is not yet implemented`,
  Fr: '',
});
export const AUTH503 = {
  En: `Sorry, this action cannot be processed now. Consider trying later or with another account`,
  Fr: '',
};
