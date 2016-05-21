using System.Collections.Generic;
using System.Linq;
using IdentityServer4.Core.Extensions;
using IdentityServer4.Core.Models;
using IdentityServer4.Core.Services;

namespace Host.UI.Consent
{
    public class ConsentViewModel : ConsentInputModel
    {
        public ConsentViewModel(ConsentInputModel model, string consentId, ConsentRequest request, Client client, IEnumerable<Scope> scopes, ILocalizationService localization)
        {
            RememberConsent = model?.RememberConsent ?? true;
            ScopesConsented = model?.ScopesConsented ?? Enumerable.Empty<string>();

            ConsentId = consentId;

            ClientName = client.ClientName;
            ClientUrl = client.ClientUri;
            ClientLogoUrl = client.LogoUri;
            AllowRememberConsent = client.AllowRememberConsent;

            IdentityScopes = scopes.Where(x => x.Type == ScopeType.Identity).Select(x => new ScopeViewModel(localization, x, ScopesConsented.Contains(x.Name) || model == null)).ToArray();
            ResourceScopes = scopes.Where(x => x.Type == ScopeType.Resource).Select(x => new ScopeViewModel(localization, x, ScopesConsented.Contains(x.Name) || model == null)).ToArray();
        }

        public string ConsentId { get; set; }

        public string ClientName { get; set; }
        public string ClientUrl { get; set; }
        public string ClientLogoUrl { get; set; }
        public bool AllowRememberConsent { get; set; }

        public IEnumerable<ScopeViewModel> IdentityScopes { get; set; }
        public IEnumerable<ScopeViewModel> ResourceScopes { get; set; }
    }

    public class ScopeViewModel
    {
        public ScopeViewModel(ILocalizationService localization, Scope scope, bool check)
        {
            Name = scope.Name;
            DisplayName = localization.GetScopeDisplayName(scope.Name) ?? scope.DisplayName;
            Description = localization.GetScopeDescription(scope.Name) ?? scope.Description;
            Emphasize = scope.Emphasize;
            Required = scope.Required;
            Checked = check || scope.Required;
        }

        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public bool Emphasize { get; set; }
        public bool Required { get; set; }
        public bool Checked { get; set; }
    }
}
