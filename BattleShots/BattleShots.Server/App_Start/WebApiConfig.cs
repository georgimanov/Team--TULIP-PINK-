﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace BattleShots.Server
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "UsersApi",
                routeTemplate: "api/account/{action}",
                defaults: new { controller = "account", action = RouteParameter.Optional });
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
