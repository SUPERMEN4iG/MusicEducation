using MusicEducation.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service.Interfaces
{
	public interface ITestRepository
	{
		IList<GetTestsResult> GetTests(int? idUser);
		TestViewModel GetTest(int? idUser, int idTest);
		InsertUser_Question_AnswerResult InsertTestResult(int? idUser, int idTest, int idQuestion, int idAnswer, string answer_content);
		List<GetAvalibleTestsResult> GetAvalibleTests(int? idUser);
		List<GetTestsForStudentResult> GetTestsForStudent(int? idUser);
		int InsertTestWithContent(int? idUser, int? idUser_test, string test_name, int test_complexity, string question_name, string question_content);
		int UpdateUser_Test(int? idUser, int? idTest, int? validAnswers, int? validPercent);
	}
}
