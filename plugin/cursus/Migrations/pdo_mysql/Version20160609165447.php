<?php

namespace Claroline\CursusBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/06/09 04:54:48
 */
class Version20160609165447 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_cursusbundle_session_event (
                id INT AUTO_INCREMENT NOT NULL, 
                session_id INT NOT NULL, 
                event_name VARCHAR(255) NOT NULL, 
                start_date DATETIME DEFAULT NULL, 
                end_date DATETIME DEFAULT NULL, 
                description LONGTEXT DEFAULT NULL, 
                location LONGTEXT DEFAULT NULL, 
                INDEX IDX_257C3061613FECDF (session_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE claro_cursusbundle_session_event_comment (
                id INT AUTO_INCREMENT NOT NULL, 
                user_id INT NOT NULL, 
                session_event_id INT NOT NULL, 
                content LONGTEXT NOT NULL, 
                creation_date DATETIME NOT NULL, 
                edition_date DATETIME DEFAULT NULL, 
                INDEX IDX_21DFDBA8A76ED395 (user_id), 
                INDEX IDX_21DFDBA8FA5B88E3 (session_event_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_session_event 
            ADD CONSTRAINT FK_257C3061613FECDF FOREIGN KEY (session_id) 
            REFERENCES claro_cursusbundle_course_session (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_session_event_comment 
            ADD CONSTRAINT FK_21DFDBA8A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_session_event_comment 
            ADD CONSTRAINT FK_21DFDBA8FA5B88E3 FOREIGN KEY (session_event_id) 
            REFERENCES claro_cursusbundle_session_event (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_course 
            ADD session_duration INT DEFAULT 1 NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_course_session 
            ADD default_event TINYINT(1) DEFAULT '1' NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_cursusbundle_session_event_comment 
            DROP FOREIGN KEY FK_21DFDBA8FA5B88E3
        ");
        $this->addSql("
            DROP TABLE claro_cursusbundle_session_event
        ");
        $this->addSql("
            DROP TABLE claro_cursusbundle_session_event_comment
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_course 
            DROP session_duration
        ");
        $this->addSql("
            ALTER TABLE claro_cursusbundle_course_session 
            DROP default_event
        ");
    }
}