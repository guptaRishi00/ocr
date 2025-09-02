import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect API routes
        if (req.nextUrl.pathname.startsWith("/api/ocr")) {
          return !!token;
        }
        
        // Protect dashboard
        if (req.nextUrl.pathname.includes("/dashboard")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/api/ocr/:path*",
    "/api/ocr-responses/:path*",
    "/api/ocr-demo/:path*"
  ],
};
