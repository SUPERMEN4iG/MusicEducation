using MusicEducation.Core.API;
using MusicEducation.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MusicEducation.Core.Controllers
{
    public class InsertUserViewModel
    {
        public int? Id_User { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Group_Name { get; set; }
        public string Teacher_Login { get; set; }
    }

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

        [HttpGet]
        public object RemoveUser(int idUser)
        {
            return _userRepository.DeleteUser(_User.Id_User, idUser);
        }

        public object InsertUser(InsertUserViewModel model)
        {
            dynamic result = new object();

            if (model.Id_User == null)
            {
                result = _userRepository.InsertUser(
                    _User.Id_User,
                    model.Login,
                    System.Web.Helpers.Crypto.HashPassword(model.Password),
                    model.LastName,
                    model.FirstName,
                    model.MiddleName,
                    model.Name,
                    model.Group_Name,
                    model.Teacher_Login
                );
            }
            else 
            {
                var user = _userRepository.GetUser(_User.Id_User, model.Id_User.Value);

                result = _userRepository.UpdateUser(
                        _User.Id_User,
                        model.Id_User,
                        model.LastName,
                        model.FirstName,
                        model.MiddleName,
                        model.Login,
                        (String.IsNullOrEmpty(model.Password) ? user.Password : System.Web.Helpers.Crypto.HashPassword(model.Password)),
                        model.Name,
                        model.Group_Name,
                        model.Teacher_Login
                    );
            }

            return result;
        }

        public object GetNotifications()
        {
            return _userRepository.GetUser_Notifications(_User.Id_User);
        }

        public object GetGroups()
        {
            return _userRepository.GetGroups(_User.Id_User);
        }

        public object GetTeachers()
        {
            return _userRepository.GetUsers(_User.Id_User).Where(x => x.Id_Role == 2).ToList();
        }
	}
}