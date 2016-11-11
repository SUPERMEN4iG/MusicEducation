﻿using MusicEducation.Service.Interfaces;
using MusicEducation.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
	public class TestRepository : BaseRepository, ITestRepository
	{
		public IList<GetTestsResult> GetTests(int? idUser)
		{
			return base._DBContext.GetTests(idUser).ToList();
		}

		public TestViewModel GetTest(int? idUser, int idTest)
		{
			TestViewModel test = new TestViewModel();
			var listTest = base._DBContext.GetTest(idUser, idTest).ToList();

            if (listTest == null)
            {
                return null;
            }

			test.Id = listTest.FirstOrDefault().Id_Test;
			test.Name = listTest.FirstOrDefault().Test_Name;
			test.IsCompleted = listTest.FirstOrDefault().IsCompleted;
			test.IsShowHints = Convert.ToBoolean(listTest.FirstOrDefault().IsShowHints);
			test.CountAttempts = listTest.FirstOrDefault().CountAttempts;
			test.Id_User_TestType = listTest.FirstOrDefault().Id_User_TestType;
			test.Questions = new List<TestViewModel.QuestionModel>();

			foreach (var item in listTest.GroupBy(g => g.Question_Id))
			{
				var question = item.FirstOrDefault();
				var answers = listTest.Where(x => x.Question_Id == question.Question_Id);

				test.Questions.Add(new TestViewModel.QuestionModel() {
					Id = question.Question_Id,
					Name = question.Question_Name,
					Content = question.Question_Content,
					QuestionType = question.Question_QuestionType_Id,
					Answers = answers.Select(x => {
						return new TestViewModel.AnswerModel()
						{
							Id = x.Answer_Id,
							Name = x.Answer_Name,
							Content = x.Answer_Content,
							isUserAnswer = false,
							IsValid = x.IsValid
						};
					}).ToList()
				});
			}

			return test;
		}

        public List<GetAvalibleTestsResult> GetAvalibleTests(int? idUser)
        {
            var result = _DBContext.GetAvalibleTests(idUser).ToList();
            return result;
        }

		public List<GetTestsForStudentResult> GetTestsForStudent(int? idUser)
		{
			var result = _DBContext.GetTestsForStudent(idUser).ToList();
			return result;
		}

		public int InsertTestWithContent(int? idUser, string test_name, int test_complexity, string question_name, string question_content)
		{
			return _DBContext.InsertTestWithContent(idUser, test_name, test_complexity, question_name, question_content);
		}

		public InsertUser_Question_AnswerResult InsertTestResult(int? idUser, int idTest, int idQuestion, int idAnswer, string answer_content)
		{
			var result = _DBContext.InsertUser_Question_Answer(idUser, idTest, idQuestion, idAnswer, answer_content).FirstOrDefault();
			return result;
		}

		public int UpdateUser_Test(int? idUser, int? idTest, int? validAnswers, int? validPercent)
		{
			var result = _DBContext.UpdateUser_Test(idUser, idTest, validAnswers, validPercent);
			return result;
		}

		public int InsertQuestion_Answer(int? idUser, int? idQuestion, string answer_name, string answer_content, int? answer_isValid)
		{
			var result = _DBContext.InsertQuestion_Answer(idUser, idQuestion, answer_name, answer_content, answer_isValid).FirstOrDefault().Column1.Value;

			return result;
		}

		public int UpdateQuestion_Answer(int? idUser, int? idQuestion, int? idAnswer, string answer_name, string answer_content, int? answer_isValid)
		{
			var result = _DBContext.UpdateQuestion_Answer(idUser, idQuestion, idAnswer, answer_name, answer_content, answer_isValid);

			return result;
		}

		public int UpdateTest_Question(int? idUser, int? idQuestion, string question_name, string question_content, int? question_type)
		{
			var result = _DBContext.UpdateTest_Question(idUser, idQuestion, question_name, question_content, question_type);

			return result;
		}

		public int InsertTest_Question(int? idUser, int? idTest, string question_name, string question_content, int? question_type)
		{
			var result = _DBContext.InsertTest_Question(idUser, idTest, question_name, question_content, question_type).FirstOrDefault().Column1;

			return result.Value;
		}

		public int InsertUser_Test_Custom(int? idUser, int? idTest, string test_name, int? test_complexity, int? test_id_TestType)
		{
			var result = _DBContext.InsertUser_Test_Custom(idUser, idTest, test_name, test_complexity, test_id_TestType).FirstOrDefault().Column1;

			return result.Value;
		}

		public int UpdateUser_Test_Custom(int? idUser, int? idTest, string test_name, int? test_complexity, int? test_id_TestType)
		{
			var result = _DBContext.UpdateUser_Test_Custom(idUser, idTest, test_name, test_complexity, test_id_TestType);

			return result;
		}
	}
}
