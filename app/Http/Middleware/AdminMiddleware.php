<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        // Redirect or abort if the user is not an admin
        // Choose one of the options below:

        // Option 1: Redirect to a specific route (e.g., home page)
        return redirect('/');

        // Option 2: Abort with an HTTP error
        abort(403, 'Unauthorized');
    }
}
