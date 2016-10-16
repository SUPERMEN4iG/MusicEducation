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
		InsertUser_Question_AnswerResult InsertTestResult(int? idUser, int idTest, int idQuestion, int idAnswer);
        List<GetAvalibleTestsResult> GetAvalibleTests(int? idUser);
	}
}
