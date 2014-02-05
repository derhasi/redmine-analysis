# Require any additional compass plugins here.
require 'ruby_gntp'
require 'compass-normalize'
require 'rgbapng'
require 'toolkit'
require 'singularitygs'
require 'sass-globbing'
require 'ruby_gntp'

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "app/stylesheets"
sass_dir = "app/scss"
images_dir = "app/images"
javascripts_dir = "javascripts"
fonts_dir = "fonts"

output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

line_comments = false
color_output = false

preferred_syntax = :scss

# @see http://www.gingerleprechaun.com/general/sass-compass-growl-notifications
on_stylesheet_saved do |filename|
   GNTP.notify({
      :app_name => "Compass",
      :title     => "#{File.basename(filename)} updated!"
   })
end
