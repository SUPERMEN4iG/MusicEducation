using MusicEducation.Service;
using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MusicEducation.Web.API
{
	public class AppnedTestToUserViewModel
	{
		public int idUser { get; set; }
		public int idTest { get; set; }
	}

    public class StudentController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IStudentRepository _studentRepository;

        private readonly GetUserResult _User;

        public StudentController(IUserRepository userRepository, IStudentRepository studentRepository)
        {
            _userRepository = userRepository;
            _studentRepository = studentRepository;
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
	}
}