export const extractJwtAccessTokenFromCookie = (req: any): string | null => {
  if (
    req.cookies &&
    'access_token' in req.cookies &&
    req.cookies.access_token.length > 0
  ) {
    return req.cookies.access_token;
  }

  return null;
};

export const extractJwtRefreshTokenFromCookie = (req: any): string | null => {
  if (
    req.cookies &&
    'refresh_token' in req.cookies &&
    req.cookies.refresh_token.length > 0
  ) {
    return req.cookies.refresh_token;
  }

  return null;
};
