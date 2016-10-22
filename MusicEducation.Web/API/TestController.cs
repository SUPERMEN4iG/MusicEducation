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
using Newtonsoft.Json;

namespace MusicEducation.Web.Controllers.Api
{
	public class InsertTestWithContentViewModel
	{
		public int? idUser { get; set; }
		public int? idUser_test { get; set; }
		public string test_name { get; set; }
		public int test_complexity { get; set; }
		public string question_name { get; set; }
		public object question_content { get; set; }
		public object question_octaves { get; set; }
	}

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
        public object GetTests(int? idUser)
        {
			object result;
			var userId = idUser.HasValue ? idUser.Value : _User.Id_User;

			if (_User.Id_Role == 3)
			{
				result = _testRepository.GetTestsForStudent(userId);
			}
			else
			{
				result = _testRepository.GetTests(userId);
			}
			return result;
        }

		[ActionName("InsertTestWithContent")]
		public object InsertTestWithContent(InsertTestWithContentViewModel model)
		{
			model.test_complexity = 1;
			object completedTask = new {
				octaves = model.question_octaves,
				content = model.question_content
			};
			string completedTaskToString = JsonConvert.SerializeObject(completedTask);
			var result = _testRepository.InsertTestWithContent(model.idUser, model.idUser_test, model.test_name, model.test_complexity, model.question_name, completedTaskToString);
			return result;
		}

		[ActionName("GetTest")]
		public object GetTest(int idTest)
		{
			var result = _testRepository.GetTest(_User.Id_User, idTest);
			object simpleObjectResult = new {
				Id = result.Id,
				Name = result.Name,
				Questions = result.Questions.Select(x => {
					object contentQuestion = null;
					if (x.Content != null)
					{
						contentQuestion = JsonConvert.DeserializeObject(x.Content);
					}
					return new {
						Id = x.Id,
						Name = x.Name,
						QuestionType = x.QuestionType,
						Answers = x.Answers,
						Content = contentQuestion
					};
				})
			};
			return simpleObjectResult;
		}

        public object GetAvalibleTests()
        {
            return _testRepository.GetAvalibleTests(_User.Id_User);
        }

		[ActionName("InsertTestResult")]
		public object InsertTestResult(TestViewModel model)
		{
			InsertUser_Question_AnswerResult result = null;
			
			foreach (var question in model.Questions)
			{
				foreach (var answer in question.Answers)
				{
					if (answer.isUserAnswer)
					{
						result = _testRepository.InsertTestResult(_User.Id_User, model.Id, question.Id, answer.Id, JsonConvert.SerializeObject(answer.ContentUserAnswer));
					}
				}
			}

			_testRepository.UpdateUser_Test(
				_User.Id_User, 
				model.Id, 
				result.CountUserAnswerValid,
				result.UserAnswerValidPercent);

			return result;
		}

	}
}
