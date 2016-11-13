using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using MusicEducation.Core.Hubs;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

[assembly: OwinStartup(typeof(SignalR.Web.Startup))]
namespace SignalR.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            //var unityHubActivator = new MvcHubActivator();
            //container.Register<IChatRepository, ChatRepository>(new PerContainerLifetime());
            //app.UseCors(CorsOptions.AllowAll);
            GlobalHost.DependencyResolver.Register(typeof(NotificationHub), () => new NotificationHub());
            var config = new HubConfiguration();
            config.EnableJSONP = true;
            config.EnableDetailedErrors = true;
            //app.UseCors(CorsOptions.AllowAll);
            app.MapSignalR(config);

            //app.MapConnection<ChatEndPoint>("/echo");
        }
    }
}