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
		private readonly UserRepository _testService;

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
        public RegisterUserResult Register(UserRegisterViewModel data)
        {
            return _testService.RegisterUser(data.Username, System.Web.Helpers.Crypto.HashPassword(data.Password));
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
                    if (d_user.IsApproved.GetValueOrDefault())
                    {
                        result.Status = 1;
                        result.Message = "success";
                        _testService.InsertUser_Action(d_user.Id_User, d_user.Id_User, "Вход", String.Format("{0} вошёл в систему", d_user.Login), 1);
                    }
                    else 
                    {
                        result.Status = 3;
                        result.Message = "ваш профиль ещё не подтверждён";
                    }
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