variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "kickstart-portal"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max allocated storage in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "kickstart_db"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "kickstart_user"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "ecs_cpu" {
  description = "ECS CPU units"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "ECS memory in MB"
  type        = number
  default     = 512
}

variable "ecs_desired_count" {
  description = "ECS desired count"
  type        = number
  default     = 2
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "kickstart-portal"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}