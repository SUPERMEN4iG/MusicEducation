﻿using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MusicEducation.Service;
using MusicEducation.Service.Models;
using Newtonsoft.Json;
using MusicEducation.Core.API;
using MusicEducation.Core.Lib.Filters;
using MusicEducation.Core.Lib.Constants;
using System.Diagnostics;

namespace MusicEducation.Core.Controllers.Api
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

		public TestController()
        {
			_testRepository = new TestRepository();
			_userRepository = new UserRepository();
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
			var result = _testRepository.InsertTestWithContent(model.idUser, model.test_name, model.test_complexity, model.question_name, completedTaskToString);
			return result;
		}

		[ActionName("GetTest")]
		public object GetTest(int idTest)
		{
			var result = _testRepository.GetTest(_User.Id_User, idTest);
			object simpleObjectResult = new {
				Id = result.Id,
				Name = result.Name,
				IsCompleted = result.IsCompleted,
				CountAttempts = result.CountAttempts,
				IsShowHints = result.IsShowHints,
				Id_User_TestType = result.Id_User_TestType,
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

		[ActionName("UpdateTest")]
		public object UpdateTest(TestViewModel changes)
		{
            TestViewModel source = new TestViewModel();

            if (changes.Id != null)
            {
                source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
            }

			if (source.Id == null)
			{
				Debug.WriteLine("[NEW TEST] " + changes.Name);
				changes.Id = _testRepository.InsertUser_Test_Custom(_User.Id_User, null, changes.Name, 5, changes.Id_User_TestType);
                source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
			}

			if (source.Id != null)
			{
				if (changes.Name != source.Name)
				{
					Debug.WriteLine("[UPDATE TEST] " + changes.Name);
					_testRepository.UpdateUser_Test_Custom(_User.Id_User, source.Id, changes.Name, 5, changes.Id_User_TestType);
					source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
				}
			}

			foreach (var item in changes.Questions)
			{
				TestViewModel.QuestionModel currentQuestion = new TestViewModel.QuestionModel();

                if (source.Questions != null)
                {
                    currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
                }

				if (item.Id == null)
				{
					source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
					currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
					Debug.WriteLine("[NEW QUESTION] " + item.Name);
					item.Id = _testRepository.InsertTest_Question(_User.Id_User, changes.Id, item.Name, item.Content, item.QuestionType);
				}
				else if (currentQuestion.Id != null)
				{
					if (item.Name != currentQuestion.Name)
					{
						source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
						currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
						Debug.WriteLine("[CHANGES QUESTION] " + item.Name);
						_testRepository.UpdateTest_Question(_User.Id_User, item.Id, item.Name, item.Content, item.QuestionType);
					}
				}

				foreach (var answer in item.Answers)
				{
					TestViewModel.AnswerModel currentAnswer = new TestViewModel.AnswerModel();

                    if (currentQuestion != null && currentQuestion.Answers != null)
                    {
						source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
						currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
						currentAnswer = currentQuestion.Answers.FirstOrDefault(x => x.Id == answer.Id);
                    }

					if (answer.Id == null)
					{
						source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
						currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
						currentAnswer = currentQuestion.Answers.FirstOrDefault(x => x.Id == answer.Id);
						Debug.WriteLine("[NEW ANSWER] " + answer.Name);
						answer.Id = _testRepository.InsertQuestion_Answer(_User.Id_User, currentQuestion.Id, answer.Name, answer.Content, (answer.IsValid.GetValueOrDefault() ? 1 : 0));
					}
					else if (currentAnswer.Id != null)
					{
						if (answer.Name != currentAnswer.Name || answer.IsValid != currentAnswer.IsValid)
						{
							source = _testRepository.GetTest(_User.Id_User, changes.Id.Value);
							currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
							currentAnswer = currentQuestion.Answers.FirstOrDefault(x => x.Id == answer.Id);
							Debug.WriteLine("[CHANGES ANSWER] " + answer.Name);
							_testRepository.UpdateQuestion_Answer(_User.Id_User, currentQuestion.Id, answer.Id, answer.Name, answer.Content, (answer.IsValid.GetValueOrDefault() ? 1 : 0));
						}
					}
				}
			}

			return changes;
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
						result = _testRepository.InsertTestResult(
							_User.Id_User, 
							model.Id.Value, 
							question.Id.Value, 
							answer.Id.Value, JsonConvert.SerializeObject(answer.ContentUserAnswer));
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
