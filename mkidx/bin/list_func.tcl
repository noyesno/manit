#!/bin/env tclsh

lappend auto_path /home1/kolababy/tcl/modules

package require htmlparse


set href  ""
set title ""
set skip  0

proc url_normalize {path} {
  set buffer [list]
  foreach part [split $path "/"] {
    switch $part {
      ""  -
      "." {}
      ".." { 
        set buffer [lreplace $buffer end end] 
      }
      default {
        lappend buffer $part
      }
  
    }
  }
  return [join $buffer "/"]
}

proc get_href {params} {
  global page base
  foreach param $params {
    if [string equal -nocase -length 5 "href=" $param] {
      set href [string trim [string range $param 5 end] "'\""]
      set href [regsub {[#\?].*} $href ""]
      if [regexp {^\w+:} $href] {
        return ""
        return $href
      } elseif {[string length $href]==0} {
        return $page
      } else {
        return [url_normalize [file join $base $href]]
      }
    }
  }
  return ""
}

proc list_links {tag slash params text} {
  global page base href title 
  global skip

  if [string equal -nocase "script" $tag] {
    set skip [expr {[llength $slash]==0}] 
  } elseif $skip {
    return
  } elseif [string equal -nocase "a" $tag] {
    if [llength $slash] {
      if {[string length $href] && [llength $title]==1 && $href ne $page} {
        #-- puts "$href | $title"
        if ![info exists ::db($href,$title)] {
          set ::db($href,$title) [list $title $href]
          incr ::count($href)
          incr ::count($title)
        }
      }
      set href ""
      set title ""
    } else {
      if [catch {
        set href  [get_href $params]
      }] {
        puts "DEBUG: $params $page"
        exit 2
      }
      set title $text
    }
  }
}

proc iterate_html {dir} {
  global page base
  cd $dir 
  set pipe [open "| find . -type f -name *.htm*"] 
  while {[gets $pipe file]>=0} {
    #-- puts "File: $file"
    set page $file 
    set base [file dirname $file]
    set fp [open $file r]
    ::htmlparse::parse -cmd list_links [read $fp]
    close $fp
  }
  close $pipe
}

proc dump_list {lang version} {
  foreach {name value} [array get ::db] {
    set n $::count([lindex $value 1])
    lappend value $n
    puts [join [linsert $value 0 $lang $version] "\t"]
  }
}


#++++++++++++++++++++++++++++ main ++++++++++++++++++++++++++++a#

if {[llength $argv]!=3} {
  puts "Usage: $argv0 \$dir \$lang \$version"
  exit 1
}

lassign $argv dir lang version

iterate_html $dir
dump_list $lang $version

exit

