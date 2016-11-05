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
		int InsertTestWithContent(int? idUser, string test_name, int test_complexity, string question_name, string question_content);
		int UpdateUser_Test(int? idUser, int? idTest, int? validAnswers, int? validPercent);

		int InsertQuestion_Answer(int? idUser, int? idQuestion, string answer_name, string answer_content, int? answer_isValid);
		int UpdateQuestion_Answer(int? idUser, int? idQuestion, int? idAnswer, string answer_name, string answer_content, int? answer_isValid);
		int UpdateTest_Question(int? idUser, int? idQuestion, string question_name, string question_content, int? question_type);
		int InsertTest_Question(int? idUser, int? idTest, string question_name, string question_content, int? question_type);

		int InsertUser_Test_Custom(int? idUser, int? idTest, string test_name, int? test_complexity, int? test_id_TestType);
		int UpdateUser_Test_Custom(int? idUser, int? idTest, string test_name, int? test_complexity, int? test_id_TestType);
	}
}
