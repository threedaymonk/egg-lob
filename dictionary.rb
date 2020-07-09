require 'json'

root = {}

ARGF.each_line do |word|
  word.chomp!
  word.upcase!
  next if word.length < 3
  node = root
  word.scan(/QU|./).each do |letter|
    node = (node[letter] ||= {})
  end
  node['.'] = 1
end

puts JSON.generate(root)
