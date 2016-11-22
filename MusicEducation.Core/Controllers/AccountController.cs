using MusicEducation.Core.Lib.Constants;
using MusicEducation.Core.Lib.Filters;
using MusicEducation.Core.Models.ViewModel;
using MusicEducation.Service;
using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MusicEducation.Core.API
{
	[BasicAuthorize(UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT)]
	public class AccountController : BaseApiController
	{
		private readonly UserRepository _userService;

		public AccountController()
		{
            _userService = new UserRepository();
		}

		[ActionName("user")]
		public UserViewModel Get()
		{
			var d_user = _userService.GetUser(null, User.Identity.Name);
			UserViewModel user = new UserViewModel()
			{
				Id = d_user.Id_User,
				DateCreate = d_user.DateCreate,
				Id_UserCreate = d_user.Id_UserCreate,
				LastName = d_user.LastName,
				FirstName = d_user.FirstName,
				MiddleName = d_user.MiddleName,
				Login = d_user.Login,
				Id_Role = d_user.Id_Role.GetValueOrDefault(),
				RoleName = d_user.Name,
				Photo = d_user.Photo
			};

			return user;
		}
	}
}