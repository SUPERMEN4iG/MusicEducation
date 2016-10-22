using MusicEducation.Service.Interfaces;
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

			test.Id = listTest.FirstOrDefault().Id_Test;
			test.Name = listTest.FirstOrDefault().Test_Name;
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
							isUserAnswer = false
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

		public int InsertTestWithContent(int? idUser, int? idUser_test, string test_name, int test_complexity, string question_name, string question_content)
		{
			return _DBContext.InsertTestWithContent(idUser, idUser_test, test_name, test_complexity, question_name, question_content);
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
	}
}
