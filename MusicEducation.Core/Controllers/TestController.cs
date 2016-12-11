using MusicEducation.Service.Interfaces;
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

	public class AppendTestToGroupViewModel
	{
		public int? idGroup { get; set; }
		public int? idTest { get; set; }
		public int? attempts { get; set; }
		public int? timing { get; set; }
		public string complexity { get; set; }
	}

	public class AppendTestToUserViewModel
	{
		public int? idUser { get; set; }
		public int? idTest { get; set; }
		public int? attempts { get; set; }
		public int? timing { get; set; }
		public string complexity { get; set; }
	}

	public class AppendTaskToGroupViewModel : AppendTestToGroupViewModel
	{
		public int? userTestType { get; set; }
		public int? isShowHints { get; set; }
	}

	public class AppendTaskToUserViewModel : AppendTestToUserViewModel
	{
		public int? userTestType { get; set; }
		public int? isShowHints { get; set; }
	}

	public class UpdateUserTestTimingViewModel
	{
		public int? idUser { get; set; }
		public int? idTest { get; set; }
		public int? timing { get; set; }
		public bool? isAttemptDown { get; set; }
	}

	public class CreateTestViewModel
	{
		public string Name { get; set; }
		public string Complexity { get; set; }
		public int[] Questions { get; set; }
	}

	[BasicAuthorize(UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT)]
	public class TestController : BaseApiController
	{
		private readonly TestRepository _testRepository;
		private readonly UserRepository _userRepository;
		private readonly StudentRepository _studentRepository;

		private readonly GetUserResult _User;

		public TestController()
		{
			_testRepository = new TestRepository();
			_userRepository = new UserRepository();
			_studentRepository = new StudentRepository();
			_User = _userRepository.GetUser(null, User.Identity.Name);
		}

		[ActionName("GetTests")]
		public object GetTests(int? idUser)
		{
			object result;
			var userId = idUser.HasValue ? idUser.Value : _User.Id_User;
			result = _testRepository.GetTestsForStudent(userId).Where(x => x.TestType_Id == 1);
			//if (_User.Id_Role == 3)
			//{
			//	result = _testRepository.GetTestsForStudent(userId).Where(x => x.TestType_Id == 1);
			//}
			//else
			//{
			//	result = _testRepository.GetTests(userId).Where(x => x.TestType_Id == 1);
			//}
			return result;
		}

		[ActionName("GetTasks")]
		public object GetTasks(int? idUser)
		{
			object result;
			var userId = idUser.HasValue ? idUser.Value : _User.Id_User;
			result = _testRepository.GetTestsForStudent(userId).Where(x => x.TestType_Id == 2);
			//if (_User.Id_Role == 3)
			//{
			//	result = _testRepository.GetTestsForStudent(userId).Where(x => x.TestType_Id == 2);
			//}
			//else
			//{
			//	result = _testRepository.GetTests(userId).Where(x => x.TestType_Id == 2);
			//}
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
				Timing = result.Timing,
				TimingLeft = result.TimingLeft,
				Complexity = result.Complexity,
				Id_UserCreate = result.Id_UserCreate,
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

		[ActionName("GetTheme")]
		public object GetTheme(int idTheme)
		{
			var result = _testRepository.GetTheme(_User.Id_User, idTheme);
			object simpleObjectResult = new
			{
				Id = result.Id,
				Name = result.Name,
				IsCompleted = result.IsCompleted,
				CountAttempts = result.CountAttempts,
				IsShowHints = result.IsShowHints,
				Id_User_TestType = result.Id_User_TestType,
				Timing = result.Timing,
				TimingLeft = result.TimingLeft,
				Complexity = result.Complexity,
				Id_UserCreate = result.Id_UserCreate,
				Questions = result.Questions.Select(x => {
					object contentQuestion = null;
					if (x.Content != null)
					{
						contentQuestion = JsonConvert.DeserializeObject(x.Content);
					}
					return new
					{
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

		[ActionName("UpdateTheme")]
		public object UpdateTheme(TestViewModel changes)
		{
			TestViewModel source = new TestViewModel();

			if (changes.Id != null)
			{
				source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
			}

			if (source.Id == null)
			{
				Debug.WriteLine("[NEW THEME] " + changes.Name);
				changes.Id = _testRepository.InsertUser_Test_CustomTheme(_User.Id_User, changes.Name);
				source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
			}

			if (source.Id != null)
			{
				if (changes.Name != source.Name)
				{
					Debug.WriteLine("[UPDATE THEME] " + changes.Name);
					_testRepository.UpdateUser_Test_CustomTheme(_User.Id_User, source.Id, changes.Name);
					source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
				}
			}

            // get deleted objects
            IEnumerable<TestViewModel.QuestionModel> deletedQuestions = source.Questions.Except(changes.Questions, new QuestionCustomComparer());

            foreach (var item in deletedQuestions)
            {
                _testRepository.DeleteUser_Question(_User.Id_User, source.Id, item.Id);
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
					source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
					currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
					Debug.WriteLine("[NEW QUESTION] " + item.Name);
					item.Id = _testRepository.InsertTest_QuestionTheme(_User.Id_User, changes.Id, item.Name, item.Content, item.QuestionType);
				}
				else if (currentQuestion.Id != null)
				{
					if (item.Name != currentQuestion.Name)
					{
						source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
						currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
						Debug.WriteLine("[CHANGES QUESTION] " + item.Name);
						_testRepository.UpdateTest_Question(_User.Id_User, item.Id, item.Name, item.Content, item.QuestionType);
					}
				}

                // TODO: add answers delete

                if (currentQuestion != null)
                {
                    IEnumerable<TestViewModel.AnswerModel> deletedAnswers = currentQuestion.Answers.Except(item.Answers, new AnswerCustomComparer());

                    foreach (var deletedAnswer in deletedAnswers)
                    {
                        _testRepository.DeleteUser_Answer(_User.Id_User, source.Id, item.Id, deletedAnswer.Id);
                    }
                }

				foreach (var answer in item.Answers)
				{
					TestViewModel.AnswerModel currentAnswer = new TestViewModel.AnswerModel();

					if (currentQuestion != null && currentQuestion.Answers != null)
					{
						source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
						currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
						currentAnswer = currentQuestion.Answers.FirstOrDefault(x => x.Id == answer.Id);
					}

					if (answer.Id == null)
					{
						source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
						currentQuestion = source.Questions.FirstOrDefault(x => x.Id == item.Id);
						currentAnswer = currentQuestion.Answers.FirstOrDefault(x => x.Id == answer.Id);
						Debug.WriteLine("[NEW ANSWER] " + answer.Name);
						answer.Id = _testRepository.InsertQuestion_Answer(_User.Id_User, currentQuestion.Id, answer.Name, answer.Content, (answer.IsValid.GetValueOrDefault() ? 1 : 0));
					}
					else if (currentAnswer.Id != null)
					{
						if (answer.Name != currentAnswer.Name || answer.IsValid != currentAnswer.IsValid)
						{
							source = _testRepository.GetTheme(_User.Id_User, changes.Id.Value);
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

		public object GetAvalibleTasks()
		{
			return _testRepository.GetAvalibleTasks(_User.Id_User);
		}

        public object GetCountAppendingTest(int? id)
        {
            return _testRepository.GetCountAppendingTest(_User.Id_User, id);
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

        [ActionName("InsertTaskResult")]
        public object InsertTaskResult(TestViewModel model)
        {
            InsertUser_Question_AnswerResult result = null;
            dynamic contentUserAnswer = null;

            foreach (var question in model.Questions)
            {
                foreach (var answer in question.Answers)
                {
                    if (answer.isUserAnswer)
                    {
                        contentUserAnswer = answer.ContentUserAnswer;
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

		public object AppendTestToGroup(AppendTestToGroupViewModel model)
		{
			int complexity = 0;

			switch (model.complexity)
			{
				case "Тяжёлый":
					complexity = 3;
					break;
				case "Средний":
					complexity = 2;
					break;
				case "Лёгкий":
					complexity = 1;
					break;
				default:
					complexity = 0;
					break;
			}

			return _testRepository.AppendTestToGroup(_User.Id_User, model.idGroup, model.idTest, model.attempts, model.timing, complexity, 1, 1);
		}

		public object AppendTestToUser(AppendTaskToUserViewModel model)
		{
			int complexity = 0;

            switch (model.complexity)
            {
                case "Тяжёлый":
                    complexity = 3;
                    break;
                case "Средний":
                    complexity = 2;
                    break;
                case "Лёгкий":
                    complexity = 1;
                    break;
                default:
                    complexity = 0;
                    break;
            }

			return _studentRepository.AppnedTestToUser(_User.Id_User, model.idUser, model.idTest, model.attempts, model.timing, complexity, 1, 1);
		}

		public object AppendTaskToGroup(AppendTaskToGroupViewModel model)
		{
			int complexity = 0;

            switch (model.complexity)
            {
                case "Тяжёлый":
                    complexity = 3;
                    break;
                case "Средний":
                    complexity = 2;
                    break;
                case "Лёгкий":
                    complexity = 1;
                    break;
                default:
                    complexity = 0;
                    break;
            }

			return _testRepository.AppendTestToGroup(_User.Id_User, model.idGroup, model.idTest, model.attempts, model.timing, complexity, model.userTestType, model.isShowHints);
		}

		public object AppendTaskToUser(AppendTaskToUserViewModel model)
		{
			int complexity = 0;

            switch (model.complexity)
            {
                case "Тяжёлый":
                    complexity = 3;
                    break;
                case "Средний":
                    complexity = 2;
                    break;
                case "Лёгкий":
                    complexity = 1;
                    break;
                default:
                    complexity = 0;
                    break;
            }

			return _studentRepository.AppnedTestToUser(_User.Id_User, model.idUser, model.idTest, model.attempts, model.timing, complexity, model.userTestType, model.isShowHints);
		}

		public object UpdateUserTestTiming(UpdateUserTestTimingViewModel model)
		{
			return _testRepository.UpdateUser_Test_Timing(model.idUser, model.idTest, model.timing, model.isAttemptDown);
		}

		public object GetThemes()
		{
			return _testRepository.GetThemes(_User.Id_User);
		}

		public object GetThemeQuestions(int idTheme)
		{
			return _testRepository.GetThemeQuestions(_User.Id_User, idTheme);
		}

		public object CreateTest(CreateTestViewModel model)
		{
            if (String.IsNullOrEmpty(model.Complexity))
                model.Complexity = "0";

			int? complexity = int.Parse(model.Complexity);
			int? idCreatedTest = null;

			idCreatedTest = _testRepository.CreateTest(_User.Id_User, model.Name, complexity);

			if (idCreatedTest.HasValue)
			{
				foreach (var item in model.Questions)
				{
					_testRepository.AppendQuestionToTest(_User.Id_User, idCreatedTest, item);
				}
			}

			return idCreatedTest;
		}
	}
}
