using MusicEducation.Core.API;
using MusicEducation.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
        public string RoleName { get; set; }
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

        public object InsertUser(InsertUserViewModel model)
        {
            dynamic result = new object();

            if (model.Id_User == null)
            {
                result = _userRepository.InsertUser(
                    model.Login,
                    System.Web.Helpers.Crypto.HashPassword(model.Password),
                    model.LastName,
                    model.FirstName,
                    model.MiddleName,
                    model.RoleName
                );
            }
            else 
            {
                result = _userRepository.UpdateUser(
                        _User.Id_User,
                        model.Id_User,
                        model.LastName,
                        model.FirstName,
                        model.MiddleName,
                        model.Login,
                        model.Password,
                        model.RoleName
                    );
            }

            return result;
        }
	}
}