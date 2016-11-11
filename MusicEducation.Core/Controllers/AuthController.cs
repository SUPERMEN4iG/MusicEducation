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
	public class AuthController : BaseApiController
	{
		private readonly IUserRepository _testService;

		public AuthController()
		{
			_testService = new UserRepository();
		}

		[ActionName("GetSimple")]
		public object GetSimple()
		{
			return new { Result = 1, Date = DateTime.Now };
		}

		[ActionName("Register")]
		public InsertUserResult Register(UserRegisterViewModel data)
		{
			return _testService.InsertUser(data.Username, System.Web.Helpers.Crypto.HashPassword(data.Password), null, null, null, null);
		}

		[ActionName("Login")]
		public InsertUserResult Login(UserLoginViewModel data)
		{
			GetUserResult d_user = _testService.GetUser(null, data.Username);
			InsertUserResult result = new InsertUserResult();

			if (d_user != null)
			{
				result.DateCreate = DateTime.Now;
				result.Id = d_user.Id_User;

				if (System.Web.Helpers.Crypto.VerifyHashedPassword(d_user.Password, data.Password))
				{
					result.Status = 1;
					result.Message = "success";
				}
				else
				{
					result.Status = 2;
					result.Message = "пароль не верный";
				}
			}
			else
			{
				result.Status = 2;
				result.Message = "пользователь не найден";
			}

			return result;
		}
	}
}