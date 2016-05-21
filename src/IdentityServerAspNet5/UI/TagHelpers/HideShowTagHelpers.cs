using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Host.UI.TagHelpers
{
    [HtmlTargetElement(Attributes = "hide-if")]
    public class HideIfTagHelper : TagHelper
    {
        [HtmlAttributeName("hide-if")]
        public bool HideIf { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (HideIf)
            {
                output.SuppressOutput();
            }
        }
    }

    [HtmlTargetElement(Attributes = "show-if")]
    public class ShowIfTagHelper : TagHelper
    {
        [HtmlAttributeName("show-if")]
        public bool ShowIf { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (ShowIf == false)
            {
                output.SuppressOutput();
            }
        }
    }

    [HtmlTargetElement(Attributes = "hide-if-null")]
    public class HideIfNullTagHelper : TagHelper
    {
        [HtmlAttributeName("hide-if-null")]
        public object HideIfNull { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (HideIfNull == null)
            {
                output.SuppressOutput();
            }
        }
    }

    [HtmlTargetElement(Attributes = "show-if-null")]
    public class ShowifNullTagHelper : TagHelper
    {
        [HtmlAttributeName("show-if-null")]
        public object ShowIfNull { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (ShowIfNull != null)
            {
                output.SuppressOutput();
            }
        }
    }
}
