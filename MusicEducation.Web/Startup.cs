using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MusicEducation.Web.Startup))]
namespace MusicEducation.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
