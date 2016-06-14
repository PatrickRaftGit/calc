manage ?= python manage.py
port ?= 8081
default_options ?= --nologcapture --liveserver=localhost:$(port)
options ?=

test: static
	$(manage) test \
		$(default_options) \
		$(options)

test-backend:
	$(manage) test api contracts \
		$(default_options) \
		$(options)

test-frontend: static
	$(manage) test selenium_tests \
		-x --noinput \
		$(default_options) \
		$(options)

static:
	@# using --link allows us to work on the JS and CSS
	@# without having to run collectstatic to see changes
	$(manage) collectstatic --noinput --link > /dev/null

clean:
	rm -rf static

.PHONY: test test-frontend test-backend test-browsers static
