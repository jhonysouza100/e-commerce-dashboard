"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { OAUTH_GOOGLE_CLIENT_ID } from '@/const/constants';

function GoogleSessionWrapper({children}: { children: React.ReactNode }) {
  
  return (
    <GoogleOAuthProvider clientId={OAUTH_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default GoogleSessionWrapper;