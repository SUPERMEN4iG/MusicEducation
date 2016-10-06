using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MusicEducation.Web.App_Start
{
	public class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
			config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
			config.MapHttpAttributeRoutes();

			config.Routes.MapHttpRoute(
				name: "DefaultApi",
				routeTemplate: "api/{controller}/{action}"
			);
		}
	}
}