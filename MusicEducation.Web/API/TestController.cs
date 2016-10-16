using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MusicEducation.Service;
using MusicEducation.Web.API;
using MusicEducation.Web.Lib.Filters;
using MusicEducation.Web.Lib.Constants;
using MusicEducation.Service.Models;

namespace MusicEducation.Web.Controllers.Api
{
	[BasicAuthorize(UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT)]
    public class TestController : BaseApiController
	{
        private readonly ITestRepository _testRepository;
		private readonly IUserRepository _userRepository;

		private readonly GetUserResult _User;

		public TestController(ITestRepository testRepository, IUserRepository userRepository)
        {
			_testRepository = testRepository;
			_userRepository = userRepository;
			_User = _userRepository.GetUser(null, User.Identity.Name);
		}

		[ActionName("GetTests")]
        public object GetTests()
        {
			return _testRepository.GetTests(_User.Id_User);
        }

		[ActionName("GetTest")]
		public object GetTest(int idTest)
		{
			return _testRepository.GetTest(_User.Id_User, idTest);
		}

		[ActionName("InsertTestResult")]
		public object InsertTestResult(TestViewModel model)
		{
			object result = null;

			foreach (var question in model.Questions)
			{
				foreach (var answer in question.Answers)
				{
					if (answer.isUserAnswer)
					{
						result = _testRepository.InsertTestResult(_User.Id_User, model.Id, question.Id, answer.Id);
					}
				}
			}
			return result;
		}

	}
}
