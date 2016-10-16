using MusicEducation.Service;
using MusicEducation.Web.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace MusicEducation.Web.Lib.Filters
{
	[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
	public class BasicAuthorizeAttribute : AuthorizeAttribute
	{
		private readonly List<string> _AllowedRoles = new List<string>();
		public bool IsNeedSkipAuth { get; set; }

		public BasicAuthorizeAttribute(params string[] allowRules)
		{
			if (allowRules != null && allowRules.Length > 0)
				_AllowedRoles.AddRange(allowRules);
		}

		public override void OnAuthorization(HttpActionContext actionContext)
		{
			base.OnAuthorization(actionContext);

			BaseApiController baseController = actionContext.ControllerContext.Controller as BaseApiController;

			if (baseController != null)
			{
				using (UserRepository _userRepository = new UserRepository())
				{
					GetUserResult d_user = _userRepository.GetUser(null, baseController.User.Identity.Name);

					if (d_user == null)
						throw new Exception("User is not valid");
					else if (IsNeedSkipAuth)
						return;
					else if (_AllowedRoles.Count > 0)
					{
						bool isAccessDenied = true;

						foreach (var role in _userRepository.GetUserRoles(null, baseController.User.Identity.Name))
						{
							if (_AllowedRoles.Contains(role.RoleName))
								isAccessDenied = false;
						}

						if (isAccessDenied)
							throw new Exception("Access denied");
					}
				}
			}
		}
	}
}