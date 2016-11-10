using MusicEducation.Core.API;
using MusicEducation.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MusicEducation.Core.Controllers
{
	public class UserController : BaseApiController
	{
		UserRepository _userRepository;

		private readonly GetUserResult _User;

		public UserController()
		{
			_userRepository = new UserRepository();
			_User = _userRepository.GetUser(null, User.Identity.Name);
		}

		public object GetUsers()
		{
			return _userRepository.GetUsers(_User.Id_User);
		}

		public object GetRoles()
		{
			return _userRepository.GetRoles(_User.Id_User);
		}
	}
}