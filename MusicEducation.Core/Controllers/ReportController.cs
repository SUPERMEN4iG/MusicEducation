using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.IO;
using DocumentFormat.OpenXml.Packaging;

using DocumentFormat.OpenXml.Spreadsheet;
using System.IO.Packaging;
using System.Xml;
using DocumentFormat.OpenXml;
using System.Net.Http.Headers;
using MusicEducation.Service;
using MusicEducation.Core.Lib.Excel;
using MusicEducation.Core.API;
using MusicEducation.Core.Lib.Filters;
using MusicEducation.Core.Lib.Constants;

namespace MusicEducation.Core.Controllers
{
    [BasicAuthorize(UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT)]
    public class ReportController : BaseApiController
    {
        UserRepository _userRepository;

        private readonly string _TemplateFile = AppDomain.CurrentDomain.BaseDirectory + "Content\\Templates\\";
        //private readonly string _GeneratedDirectorySource = "Content\\GeneratedDocuments\\";
        private readonly string _GeneratedDirectoryFile = AppDomain.CurrentDomain.BaseDirectory + "Content\\GeneratedDocuments\\";

        private readonly GetUserResult _User;

        public ReportController()
        {
            _userRepository = new UserRepository();
            _User = _userRepository.GetUser(null, User.Identity.Name);
        }

        [ActionName("GetReportPerformance")]
        public HttpResponseMessage Get(string datefrom, string dateto)
        {
            //string destinationFile = Path.Combine(_GeneratedDirectoryFile, string.Format("GeneratedDocument_{0}_{1}.docx", DateTime.Today.Date.ToString("dd.MM.yyyy"), Guid.NewGuid()));
            //string sourceFile = Path.Combine(_TemplateFile, "ReportTemplate.docx");
            //try
            //{
            //    File.Copy(sourceFile, destinationFile, true);
            //    Package pkg = Package.Open(destinationFile, FileMode.Open, FileAccess.ReadWrite);

            //    Uri uri = new Uri("/word/document.xml", UriKind.Relative);
            //    PackagePart part = pkg.GetPart(uri);

            //    XmlDocument xmlMainXMLDoc = new XmlDocument();
            //    xmlMainXMLDoc.Load(part.GetStream(FileMode.Open, FileAccess.Read));

            //    xmlMainXMLDoc.InnerXml = ReplacePlaceHoldersInTemplate("123", xmlMainXMLDoc.InnerXml);

            //    // Open the stream to write document
            //    StreamWriter partWrt = new StreamWriter(part.GetStream(FileMode.Open, FileAccess.Write));
            //    //doc.Save(partWrt);
            //    xmlMainXMLDoc.Save(partWrt);

            //    partWrt.Flush();
            //    partWrt.Close();
            //    pkg.Close();
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine(ex.Message);
            //}
            //finally
            //{ 
            //    //Console.WriteLine(“\nPress Enter to continue…”);
            //    //Console.ReadLine();
            //}

            List<List<GetStatisticsForExportResult>> data = _userRepository.GetStatisticsForExport(4, DateTime.Parse(datefrom), DateTime.Parse(dateto))
                .ToList()
                .GroupBy(x => x.Group_Name)
                .Select(s => s.ToList()).ToList();

            Dictionary<string, Dictionary<string, GetStatisticsForExportResult>> resultDictionary = new Dictionary<string, Dictionary<string, GetStatisticsForExportResult>>();

            foreach (var item in data)
            {
                var listKeValue = new Dictionary<string, GetStatisticsForExportResult>();

                foreach (var itemStyle in item)
                {
                    listKeValue.Add(itemStyle.Test_Name, itemStyle);
                }

                resultDictionary.Add(item.FirstOrDefault().Group_Name, listKeValue);
            }

            string realetivePath = string.Format("GeneratedDocument_{0}_{1}.xlsx", DateTime.Today.Date.ToString("dd.MM.yyyy"), Guid.NewGuid());
            string destinationFile = Path.Combine(_GeneratedDirectoryFile, realetivePath);

            ReportExcel newReport = new ReportExcel();
            newReport.CreationDateTime = DateTime.Now.ToString("dd.MM.yyyy hh:mm:ss");
            newReport.FIO = String.Format("{0} {1}.{2}", _User.LastName, _User.FirstName[0], _User.MiddleName[0]);
            newReport.Title = "группе " + _User.Group_Name.ToString();
            newReport.ResultDictionary = resultDictionary;
            byte[] memArray = newReport.CreatePackage(destinationFile);

            HttpResponseMessage result = null;
            try
            {
                result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new ByteArrayContent(memArray);
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = realetivePath;

                return result;
            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.Gone);
            }

            //var path = System.Web.HttpContext.Current.Server.MapPath("~/Content/GeneratedDocuments/" + realetivePath);
            //HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            //var stream = new FileStream(path, FileMode.Open);
            //result.Content = new StreamContent(stream);
            //result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            //result.Content.Headers.ContentDisposition.FileName = Path.GetFileName(path);
            //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            //result.Content.Headers.ContentLength = stream.Length;
            //return result;   

            //try
            //{
            //    using (SpreadsheetDocument document = SpreadsheetDocument.Open(destinationFile, true))
            //    {
            //        WorkbookPart workbookPart = document.AddWorkbookPart();
            //        workbookPart.Workbook = new Workbook();

            //        WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            //        worksheetPart.Worksheet = new Worksheet(new SheetData());

            //        Sheets sheets = workbookPart.Workbook.AppendChild(new Sheets());
            //        Sheet sheet = new Sheet() { Id = workbookPart.GetIdOfPart(worksheetPart), SheetId = 1, Name = "Расход за день" };
            //        SheetData sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

            //        SharedStringTablePart sharedStringTablePart1 = workbookPart.AddNewPart<SharedStringTablePart>("rId4");
            //        GenerateSharedStringTablePart1Content(sharedStringTablePart1);

            //        //Cell refCell = null;
            //        //foreach (Cell cell in row.Elements<Cell>())
            //        //{
            //        //    if (string.Compare(cell.CellReference.Value, "B1", true) > 0)
            //        //    {
            //        //        refCell = cell;
            //        //        break;
            //        //    }
            //        //}

            //        //for (uint i = 1; i <= 10; i++)
            //        //{
            //        //    Row row;
            //        //    row = new Row() { RowIndex = i };
            //        //    sheetData.Append(row);

            //        //    Cell newCell = new Cell() { CellReference = "B" + i };
            //        //    row.InsertAt(newCell, 0);
            //        //    //row.InsertAfter(newCell, refCell);
            //        //    newCell.CellValue = new CellValue((100 * i).ToString());
            //        //    newCell.DataType = new EnumValue<CellValues>(CellValues.Number);
            //        //}

            //        sheets.Append(sheet);

            //        workbookPart.Workbook.Save();
            //    }
            //}
            //catch (Exception)
            //{

            //    throw;
            //}
        }
    }
}