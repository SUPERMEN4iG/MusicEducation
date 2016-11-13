﻿using MusicEducation.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
    public class StudentRepository : BaseRepository
    {
        public List<GetStudentsResult> GetStudents(int? idUser)
        {
            var result = _DBContext.GetStudents(idUser).ToList();

            return result;
        }

		public InsertUser_TestResult AppnedTestToUser(int? idMainUser, int? idUser, int? idTest, int? countAttempts)
		{
            if (!countAttempts.HasValue)
                countAttempts = 1;

            var result = _DBContext.InsertUser_Test(idMainUser, idUser, idTest, 1, countAttempts, true).FirstOrDefault();

			return result;
		}

		public InsertUser_TestResult AppnedTestToUserWithContent(int? idMainUser, int? idUser, int? idTest, int? idUserTestType, int? countAttempts, bool? isShowHints)
		{
			var result = _DBContext.InsertUser_Test(idMainUser, idUser, idTest, idUserTestType, countAttempts, isShowHints).FirstOrDefault();

			return result;
		}
	}
}
