import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/product(.*)"]);
 
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
  //   return nextjsMiddlewareRedirect(request, "/product");
  // }
  // if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
  //   return nextjsMiddlewareRedirect(request, "/signin");
  // }

    // Default case: If the route does not match sign-in or protected routes and the user is not authenticated
    if (!isSignInPage(request) && !isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/signin");
    }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};