<?php
/**
 * Input Validation Helper
 */

class Validator {
    private $data;
    private $errors = [];
    
    public function __construct($data) {
        $this->data = $data;
    }
    
    public static function make($data) {
        return new self($data);
    }
    
    public function required($field, $message = null) {
        if (!isset($this->data[$field]) || empty(trim($this->data[$field]))) {
            $this->errors[$field][] = $message ?: "The {$field} field is required";
        }
        return $this;
    }
    
    public function email($field, $message = null) {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field][] = $message ?: "The {$field} field must be a valid email";
        }
        return $this;
    }
    
    public function min($field, $min, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $min) {
            $this->errors[$field][] = $message ?: "The {$field} field must be at least {$min} characters";
        }
        return $this;
    }
    
    public function max($field, $max, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) > $max) {
            $this->errors[$field][] = $message ?: "The {$field} field must not exceed {$max} characters";
        }
        return $this;
    }
    
    public function match($field1, $field2, $message = null) {
        if (isset($this->data[$field1]) && isset($this->data[$field2]) && $this->data[$field1] !== $this->data[$field2]) {
            $this->errors[$field2][] = $message ?: "The {$field2} field must match {$field1}";
        }
        return $this;
    }
    
    public function in($field, $values, $message = null) {
        if (isset($this->data[$field]) && !in_array($this->data[$field], $values)) {
            $this->errors[$field][] = $message ?: "The {$field} field must be one of: " . implode(', ', $values);
        }
        return $this;
    }
    
    public function phone($field, $message = null) {
        if (isset($this->data[$field])) {
            $phone = preg_replace('/[^0-9+]/', '', $this->data[$field]);
            if (strlen($phone) < 10 || strlen($phone) > 15) {
                $this->errors[$field][] = $message ?: "The {$field} field must be a valid phone number";
            }
        }
        return $this;
    }
    
    public function fails() {
        return !empty($this->errors);
    }
    
    public function errors() {
        return $this->errors;
    }
    
    public static function validateAndRespond($data, $rules) {
        $validator = new self($data);
        
        foreach ($rules as $rule) {
            call_user_func_array([$validator, $rule['method']], $rule['params']);
        }
        
        if ($validator->fails()) {
            Response::validation($validator->errors());
        }
        
        return true;
    }
}