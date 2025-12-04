# examples/ruby/sample.rb
# Minimal Ruby sample so CodeQL can run Ruby analysis

class PaymentExample
  def initialize(amount_cents)
    @amount_cents = amount_cents
  end

  def valid?
    @amount_cents.to_i > 0
  end

  def process
    raise "Invalid amount" unless valid?
    # fake processing
    puts "Processing #{@amount_cents} cents..."
  end
end

if __FILE__ == $0
  PaymentExample.new(100).process
end
