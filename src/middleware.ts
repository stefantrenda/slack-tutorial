import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isPublicPage = createRouteMatcher(["/auth"]);
const isProtectedRoute = createRouteMatcher(["/product(.*)"]);
 
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // if (isPublicPage(request) && (await convexAuth.isAuthenticated())) {
  //   return nextjsMiddlewareRedirect(request, "/product");
  // }
  // if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
  //   return nextjsMiddlewareRedirect(request, "/signin");
  // }

   
    if (!isPublicPage(request) && !isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/auth");
    }
    if (isPublicPage(request) &&  (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/");
    }


    //Redirect user form /auth in if authenticated
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};