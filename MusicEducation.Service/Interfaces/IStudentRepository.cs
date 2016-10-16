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
    }
}
