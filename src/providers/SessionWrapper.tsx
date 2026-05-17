"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import env from "@/utils/handleEnviroments";

function SessionWrapper({children}: { children: React.ReactNode }) {
  
  return (
    <GoogleOAuthProvider clientId={env.OAUTH_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default SessionWrapper;