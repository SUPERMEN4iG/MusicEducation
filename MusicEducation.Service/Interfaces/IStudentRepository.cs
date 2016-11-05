using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service.Interfaces
{
    public interface IStudentRepository
    {
        List<GetStudentsResult> GetStudents(int? idUser);
		InsertUser_TestResult AppnedTestToUser(int? idMainUser, int? idUser, int? idTest);
		InsertUser_TestResult AppnedTestToUserWithContent(int? idMainUser, int? idUser, int? idTest, int? idUserTestType, int? countAttempts, bool? isShowHints);

	}
}
