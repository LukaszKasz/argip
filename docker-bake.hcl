variable "REGISTRY_URL" {
  default = "registry.advox.pl:8443"
}

variable "REGISTRY_PATH" {
  default = "argip/calculator"
}

variable "PYTHON_VERSION" {
  default = "3.11"
}

variable "USER" {
}

variable "CI_COMMIT_SHORT_SHA" {
    default = "${USER}"
}

variable "CI_COMMIT_TAG" {
    default = ""
}

variable "BASE_IMAGE_NAME" {
    default = "base"
}

variable "APP_IMAGE_NAME" {
    default = "app"
}

variable "FRONTEND_IMAGE_NAME" {
    default = "frontend"
}

group "default" {
  targets = ["app", "frontend"]
}

# Base stage - useful for caching dependencies
target "base" {
  dockerfile = "Dockerfile"
  target     = "dependencies"

  args = {
    PYTHON_VERSION = "${PYTHON_VERSION}"
  }

  tags = [
    equal("",CI_COMMIT_TAG) && notequal("",CI_COMMIT_SHORT_SHA) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${BASE_IMAGE_NAME}:${CI_COMMIT_SHORT_SHA}": "",
    notequal("",CI_COMMIT_TAG) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${BASE_IMAGE_NAME}:${CI_COMMIT_TAG}": "",
    notequal("",CI_COMMIT_TAG) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${BASE_IMAGE_NAME}:latest": "",
  ]

  output = ["type=registry"]
  platforms = ["linux/amd64"]
}

# Application image (backend)
target "app" {
  dockerfile = "Dockerfile"
  target     = "application"

  args = {
    PYTHON_VERSION = "${PYTHON_VERSION}"
  }

  tags = [
    equal("",CI_COMMIT_TAG) && notequal("",CI_COMMIT_SHORT_SHA) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${APP_IMAGE_NAME}:${CI_COMMIT_SHORT_SHA}": "",
    notequal("",CI_COMMIT_TAG) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${APP_IMAGE_NAME}:${CI_COMMIT_TAG}": "",
    notequal("",CI_COMMIT_TAG) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${APP_IMAGE_NAME}:latest": "",
  ]

  platforms = ["linux/amd64"]
  output = ["type=registry"]
}

# Frontend image
target "frontend" {
  dockerfile = "Dockerfile"
  target     = "frontend"

  tags = [
    equal("",CI_COMMIT_TAG) && notequal("",CI_COMMIT_SHORT_SHA) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${FRONTEND_IMAGE_NAME}:${CI_COMMIT_SHORT_SHA}": "",
    notequal("",CI_COMMIT_TAG) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${FRONTEND_IMAGE_NAME}:${CI_COMMIT_TAG}": "",
    notequal("",CI_COMMIT_TAG) ? "${REGISTRY_URL}/${REGISTRY_PATH}/${FRONTEND_IMAGE_NAME}:latest": "",
  ]

  platforms = ["linux/amd64"]
  output = ["type=registry"]
}
