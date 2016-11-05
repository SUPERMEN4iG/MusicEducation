using MusicEducation.Service;
using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MusicEducation.Core.API
{
	public class AppnedTestToUserViewModel
	{
		public int idUser { get; set; }
		public int idTest { get; set; }
	}

	public class AppnedTestToUserWithContentViewModel : AppnedTestToUserViewModel
	{
		public int? idUserTestType { get; set; }
		public int? countAttempts { get; set; }
		public bool? isShowHints { get; set; }
	}

    public class StudentController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IStudentRepository _studentRepository;

        private readonly GetUserResult _User;

        public StudentController()
        {
            _userRepository = new UserRepository();
            _studentRepository = new StudentRepository();
            _User = _userRepository.GetUser(null, User.Identity.Name);
        }

        public object GetStudents()
        {
            return _studentRepository.GetStudents(_User.Id_User);
        }

        public object GetStudent(int id)
        {
            return _userRepository.GetUser(_User.Id_User, id);
        }

		public object AppnedTestToUser(AppnedTestToUserViewModel data)
		{
			return _studentRepository.AppnedTestToUser(_User.Id_User, data.idUser, data.idTest);
		}

		public object AppnedTestToUserWithContent(AppnedTestToUserWithContentViewModel data)
		{
			return _studentRepository.AppnedTestToUserWithContent(_User.Id_User, data.idUser, data.idTest, data.idUserTestType, data.countAttempts, data.isShowHints);
		}
	}
}