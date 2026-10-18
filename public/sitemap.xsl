<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap — Free Marriage Biodata Maker (biodata.cogify.me)</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1c1917; background: #faf8f5; margin: 0; padding: 32px 20px; }
          .wrap { max-width: 1080px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 28px 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
          h1 { margin: 0 0 8px; color: #8b1e2f; font-size: 24px; }
          p { margin: 0 0 20px; color: #57534e; font-size: 14px; line-height: 1.5; }
          a { color: #8b1e2f; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
          table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
          th { text-align: left; background: #8b1e2f; color: #ffffff; padding: 10px 12px; font-weight: 600; }
          td { padding: 10px 12px; border-bottom: 1px solid #f0ece1; }
          tr:hover td { background: #fdfbf7; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 11.5px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>XML Sitemap — BiodataMaker (biodata.cogify.me)</h1>
          <p>
            This XML Sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> canonical indexable URLs for
            <a href="https://biodata.cogify.me">biodata.cogify.me</a> (crafted by <a href="https://cogify.me">Cogify.me</a>) for Google, Bing, and international search engines.
          </p>
          <table>
            <thead>
              <tr>
                <th>Canonical URL</th>
                <th>Priority</th>
                <th>Change Freq</th>
                <th>Images</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
                    <a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td><span class="badge"><xsl:value-of select="sitemap:priority"/></span></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="count(image:image)"/></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
