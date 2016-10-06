using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MusicEducation.Service
{
	public class BaseRepository : IDisposable
	{
		protected readonly ApplicationDataContext _DBContext;

		protected BaseRepository()
		{
			_DBContext = new ApplicationDataContext();
		}

		public void Dispose()
		{
			_DBContext.Dispose();
		}
	}
}
