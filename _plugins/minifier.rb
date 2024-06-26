require 'cssminify2'
require 'uglifier'

module Jekyll
  class Minifier < Generator
    safe true

    def generate(site)
      Jekyll::Hooks.register :site, :post_write do |site|
        compress_files(site)
      end
    end

    private

    def compress_files(site)
      Dir.glob(File.join(site.dest, "**", "*")).each do |file|
        next if File.directory?(file)

        case File.extname(file)
        when '.js'
          compress_file(file) { |content| compress_js(content) }
        when '.css'
          compress_file(file) { |content| compress_css(content) }
        end
      end
    end

    def compress_file(file_path)
      content = File.read(file_path)
      compressed_content = yield content
      File.open(file_path, 'w') { |f| f.write(compressed_content) }
    end

    def compress_js(content)
      Uglifier.new(harmony: true).compile(content)
    end

    def compress_css(content)
      CSSminify2.new.compress(content)
    end
  end
end
