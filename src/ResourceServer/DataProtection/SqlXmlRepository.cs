using Microsoft.AspNetCore.DataProtection.Repositories;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Xml.Linq;

namespace ResourceServer.DataProtection
{
    public class SqlXmlRepository : IXmlRepository
    {
        private readonly DataProtectionDbContext DataProtectionDbContext;

        public SqlXmlRepository(DataProtectionDbContext context)
        {
            DataProtectionDbContext = context;
        }

        public IReadOnlyCollection<XElement> GetAllElements()
        {
            return new ReadOnlyCollection<XElement>(DataProtectionDbContext.DataProtectionXMLElements.Select(x => XElement.Parse(x.Xml)).ToList());
        }

        public void StoreElement(XElement element, string friendlyName)
        {
            DataProtectionDbContext.DataProtectionXMLElements.Add(
                new DataProtectionElement
                {
                    Xml = element.ToString(SaveOptions.DisableFormatting)
                }
            );

            DataProtectionDbContext.SaveChanges();
        }
    }
}
