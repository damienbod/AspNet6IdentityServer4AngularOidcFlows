using System;

namespace ResourceServer.DataProtection
{
    public class DataProtectionElement
    {
        public DataProtectionElement()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; set; }

        public string Xml { get; set; }
    }
}