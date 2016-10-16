using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
    public class StudentRepository : BaseRepository, IStudentRepository
    {
        public List<GetStudentsResult> GetStudents(int? idUser)
        {
            var result = _DBContext.GetStudents(idUser).ToList();

            return result;
        }
    }
}
